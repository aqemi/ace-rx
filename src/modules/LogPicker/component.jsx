'use strict';

import React, { Component } from 'react';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import cssVars from '../../style/variables.module.less';
import { isDesktopViewport } from '../../utils';
import * as api from './api';

function LogPickerDrawer({ isOpen, onClose, children }) {
  const desktop = useMediaQuery(cssVars.desktop);

  if (desktop) {
    return (
      <Drawer
        variant='persistent'
        anchor='right'
        open={isOpen}
        className={`log-picker${isOpen ? '' : ' log-picker--closed'}`}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Drawer anchor='right' open={isOpen} onClose={onClose} className='log-picker'>
      {children}
    </Drawer>
  );
}

export default class LogPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minDate: null
    };
  }

  componentDidMount() {
    api
      .loadEarliest()
      .then((data) => {
        if (data && data.earliest) {
          this.setState({ minDate: dayjs.unix(data.earliest) });
        }
      })
      .catch(console.error);
  }

  handleAccept(value) {
    if (value) {
      this.props.load(value.toISOString());
      if (!isDesktopViewport()) {
        this.props.close();
      }
    }
  }

  render() {
    return (
      <LogPickerDrawer isOpen={this.props.isOpen} onClose={() => this.props.close()}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
          <StaticDatePicker
            key={this.props.isOpen}
            defaultValue={dayjs()}
            onChange={value => this.handleAccept(value)}
            onClose={() => this.props.close()}
            minDate={this.state.minDate}
            maxDate={dayjs()}
            slotProps={{ actionBar: { actions: ['cancel'] } }}
            localeText={{
              toolbarTitle: 'Выберите дату',
              cancelButtonLabel: 'Закрыть'
            }}
          />
        </LocalizationProvider>
      </LogPickerDrawer>
    );
  }
}
