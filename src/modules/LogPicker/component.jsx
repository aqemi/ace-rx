'use strict';

import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default class LogPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dayjs()
    };
  }

  handleAccept(value) {
    if (value) {
      this.props.load(value.toISOString());
    }
    this.props.close();
  }

  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={() => this.props.close()}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
          <StaticDatePicker
            value={this.state.value}
            onChange={newValue => this.setState({ value: newValue })}
            onAccept={value => this.handleAccept(value)}
            onClose={() => this.props.close()}
            minDate={dayjs(new Date(2012, 0, 29))}
            maxDate={dayjs()}
            localeText={{
              toolbarTitle: 'Выберите дату',
              cancelButtonLabel: 'Закрыть',
              okButtonLabel: 'Показать'
            }}
          />
        </LocalizationProvider>
      </Dialog>
    );
  }
}
