/* global newspack_support_data */

/**
 * External dependencies
 */
import Happychat from 'happychat-client';

/**
 * WordPress dependencies
 */
import { Fragment, Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { withWizardScreen, Notice, Button } from '../../../../components/src';
import './style.scss';

/**
 * Chat Support screen.
 */
class Chat extends Component {
	state = {
		hasToAuthenticate: false,
	};

	closeHappychat = null;

	componentDidMount() {
		const { WPCOM_ACCESS_TOKEN } = newspack_support_data;

		if ( WPCOM_ACCESS_TOKEN ) {
			this.closeHappychat = Happychat.open( {
				nodeId: 'newspack-happychat',
				authentication: {
					type: 'wpcom-oauth-by-token',
					options: { token: WPCOM_ACCESS_TOKEN },
				},
				entry: 'ENTRY_CHAT',
				// BUG in happychat-client - no default defaultValues
				entryOptions: {
					defaultValues: {},
				},
			} );
		} else {
			this.setState( { hasToAuthenticate: true } );
		}
	}

	componentWillUnmount() {
		if ( this.closeHappychat ) {
			this.closeHappychat();
		}
	}

	render() {
		return (
			<Fragment>
				{ this.state.hasToAuthenticate ? (
					<Fragment>
						<Notice
							noticeText={ __(
								'Click the button below to authenticate using a WordPress.com account.',
								'newspack'
							) }
						/>
						<div className="newspack-buttons-card">
							<Button href={ newspack_support_data.WPCOM_AUTH_URL } isPrimary>
								{ __( 'Authenticate', 'newspack' ) }
							</Button>
						</div>
					</Fragment>
				) : (
					<div id="newspack-happychat" />
				) }
			</Fragment>
		);
	}
}

export default withWizardScreen( Chat );
