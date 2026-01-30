'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import { fullWhite } from 'material-ui/styles/colors';
import emitter from '../../emitter';

export default function HeaderMenu(props) {
  return (
    <IconMenu
      iconButtonElement={
        <IconButton iconClassName='material-icons' tooltip='Меню'>
          menu
        </IconButton>
      }
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      style={{ zIndex: 1 }}
      iconStyle={{ color: fullWhite }}
    >
      <MenuItem
        leftIcon={
          <FontIcon className='material-icons'>
            settings
          </FontIcon>
        }
        onTouchTap={props.openSettings}
        primaryText='Настройки/Тема'
      />
      <MenuItem
        leftIcon={<FontIcon className='fa fa-brands fa-telegram' />}
        href={import.meta.env.VITE_TG_LINK}
        target='_blank'
        primaryText='Телеграм'
      />
      <MenuItem
        leftIcon={<FontIcon className='fa fa-brands fa-github' />}
        href={import.meta.env.VITE_GH_LINK}
        target='_blank'
        primaryText='Github'
      />
      <MenuItem
        leftIcon={<FontIcon className='fa fa-brands fa-envelope' />}
        href={`mailto:${atob(__APP_EMAIL_B64__)}`}
        primaryText='Написать нам'
      />
      <MenuItem
        leftIcon={<FontIcon className='fa fa-history' />}
        onTouchTap={() => emitter.emit('openLogPicker')}
        primaryText='Логи чата'
      />

      <MenuItem
        leftIcon={<FontIcon className='material-icons'>clear_all</FontIcon>}
        primaryText='Очистить игнор-лист'
        onTouchTap={props.ignoreClear}
      />
      <Divider />
      <MenuItem disabled primaryText='Версия' secondaryText={__APP_VERSION__} />
    </IconMenu>
  );
}

HeaderMenu.propTypes = {
  ignoreClear: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired
};
