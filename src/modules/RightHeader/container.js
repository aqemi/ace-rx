import { connect } from 'react-redux';
import Component from './component';
import { actions as chat } from '../Chat';
import { actions as settings } from '../Settings';
import { actions as logPicker } from '../LogPicker';
import { actions as banManager } from '../BanManager';

function mapStateToProps(state) {
  return {
    topic: state.info.topic,
    online: state.info.online,
    logDate: state.chat.logDate ? new Date(state.chat.logDate) : null,
    displayAdminControls: state.avatar.isAdmin
  };
}

const actions = {
  ignoreClear: chat.ignoreClear,
  openSettings: settings.open,
  openLogPicker: logPicker.open,
  openBanManager: banManager.open
};

export default connect(mapStateToProps, actions)(Component);
