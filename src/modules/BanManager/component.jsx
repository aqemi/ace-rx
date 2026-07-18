import React, { Component } from 'react';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as api from './api';

const TABLE_CHAT = '0';
const TABLE_PLAYLIST = '1';

function typeLabel(type) {
  return String(type) === TABLE_PLAYLIST ? 'Плейлист' : 'Чат';
}

const initialForm = {
  table: TABLE_CHAT,
  target: '',
  reason: '',
  expire: ''
};

export default class BanManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bans: [],
      loading: false,
      filter: '',
      form: { ...initialForm },
      submitting: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.loadBans();
    }
  }

  loadBans() {
    this.setState({ loading: true });
    api
      .list()
      .then((bans) => this.setState({ bans: Array.isArray(bans) ? bans : [], loading: false }))
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  }

  handleFormChange(field, value) {
    this.setState((prevState) => ({ form: { ...prevState.form, [field]: value } }));
  }

  handleAdd() {
    const { form } = this.state;
    if (!form.target.trim()) {
      return;
    }
    this.setState({ submitting: true });
    api
      .banTarget({
        table: form.table,
        target: form.target.trim(),
        reason: form.reason.trim(),
        expire: form.expire ? dayjs(form.expire).unix() : null
      })
      .then((message) => {
        if (message) {
          this.props.notify(message);
        }
        this.setState({ form: { ...initialForm }, submitting: false });
        this.loadBans();
      })
      .catch((error) => {
        console.error(error);
        this.setState({ submitting: false });
      });
  }

  handleRemove(ban) {
    const target = ban.asn || ban.mask;
    if (!target) {
      return;
    }
    if (!window.confirm(`Remove ban for ${target}?`)) {
      return;
    }
    api
      .unban({ table: ban.type, target })
      .then((message) => {
        if (message) {
          this.props.notify(message);
        }
        this.loadBans();
      })
      .catch(console.error);
  }

  filteredBans() {
    const filter = this.state.filter.trim().toLowerCase();
    if (!filter) {
      return this.state.bans;
    }
    return this.state.bans.filter((ban) => {
      const mask = (ban.mask || '').toLowerCase();
      const asn = (ban.asn || '').toLowerCase();
      return mask.includes(filter) || asn.includes(filter);
    });
  }

  render() {
    const { isOpen, onClose } = this.props;
    const {
      loading, filter, form, submitting
    } = this.state;
    const bans = this.filteredBans();

    return (
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={false} className='ban-manager'>
        <DialogTitle className='ban-manager__title'>
          Управление банами
          <IconButton onClick={onClose} className='ban-manager__close'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className='ban-manager__content'>
          <div className='ban-manager__add'>
            <TextField
              select
              size='small'
              label='Тип'
              value={form.table}
              onChange={(e) => this.handleFormChange('table', e.target.value)}
              className='ban-manager__add-type'
            >
              <MenuItem value={TABLE_CHAT}>Чат</MenuItem>
              <MenuItem value={TABLE_PLAYLIST}>Плейлист</MenuItem>
            </TextField>
            <TextField
              size='small'
              label='IP / CIDR / ASN'
              placeholder='1.2.3.0/24 или AS13335 или 1.2.3.*'
              value={form.target}
              onChange={(e) => this.handleFormChange('target', e.target.value)}
              className='ban-manager__add-target'
            />
            <TextField
              size='small'
              label='Причина'
              value={form.reason}
              onChange={(e) => this.handleFormChange('reason', e.target.value)}
              className='ban-manager__add-reason'
            />
            <TextField
              size='small'
              type='datetime-local'
              label='Истекает'
              value={form.expire}
              onChange={(e) => this.handleFormChange('expire', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              className='ban-manager__add-expire'
            />
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => this.handleAdd()}
              disabled={submitting || !form.target.trim()}
            >
              Забанить
            </Button>
          </div>

          <div className='ban-manager__toolbar'>
            <TextField
              size='small'
              label='Фильтр по IP или ASN'
              value={filter}
              onChange={(e) => this.setState({ filter: e.target.value })}
              className='ban-manager__filter'
            />
            <IconButton onClick={() => this.loadBans()} title='Обновить'>
              <RefreshIcon />
            </IconButton>
          </div>

          {loading ? (
            <div className='ban-manager__loading'>
              <CircularProgress size={28} />
            </div>
          ) : (
            <Table size='small' className='ban-manager__table'>
              <TableHead>
                <TableRow>
                  <TableCell>Цель</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Причина</TableCell>
                  <TableCell>Создан</TableCell>
                  <TableCell>Истекает</TableCell>
                  <TableCell align='right' />
                </TableRow>
              </TableHead>
              <TableBody>
                {bans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' className='ban-manager__empty'>
                      Баны не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  bans.map((ban) => (
                    <TableRow key={ban.id}>
                      <TableCell>{ban.asn || ban.mask}</TableCell>
                      <TableCell>
                        <Chip size='small' label={typeLabel(ban.type)} />
                      </TableCell>
                      <TableCell>{ban.reason || '—'}</TableCell>
                      <TableCell>
                        {ban.timestamp && Number(ban.timestamp) > 0
                          ? dayjs.unix(Number(ban.timestamp)).format('DD.MM.YYYY HH:mm')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {ban.expire && Number(ban.expire) > 0
                          ? dayjs.unix(Number(ban.expire)).format('DD.MM.YYYY HH:mm')
                          : 'Навсегда'}
                      </TableCell>
                      <TableCell align='right'>
                        <Tooltip title='Разбанить'>
                          <IconButton size='small' color='error' onClick={() => this.handleRemove(ban)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
