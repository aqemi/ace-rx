'use strict';

import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import * as api from './api';

export default class LogPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minDate: null
    };
  }

  componentDidMount() {
    api.loadEarliest()
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
    }
    this.props.close();
  }

  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={() => this.props.close()}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
          <StaticDatePicker
            defaultValue={dayjs()}
            onAccept={value => this.handleAccept(value)}
            onClose={() => this.props.close()}
            minDate={this.state.minDate}
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
