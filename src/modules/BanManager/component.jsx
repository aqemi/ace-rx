import React, { useEffect, useState } from 'react';
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
import Skeleton from '@mui/material/Skeleton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as api from './api';

const TABLE_CHAT = '0';
const TABLE_PLAYLIST = '1';
const SKELETON_ROWS = 5;
const TABLE_COLUMNS = 6;

function typeLabel(type) {
  return String(type) === TABLE_PLAYLIST ? 'Плейлист' : 'Чат';
}

const initialForm = {
  table: TABLE_CHAT,
  target: '',
  reason: '',
  expire: ''
};

export default function BanManager(props) {
  const { isOpen, onClose, notify } = props;
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const loadBans = () => {
    setLoading(true);
    api
      .list()
      .then((result) => {
        setBans(Array.isArray(result) ? result : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // Load whenever the dialog transitions to open, matching the previous
  // componentDidUpdate behavior.
  useEffect(() => {
    if (isOpen) {
      loadBans();
    }
  }, [isOpen]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.target.trim()) {
      return;
    }
    setSubmitting(true);
    api
      .banTarget({
        table: form.table,
        target: form.target.trim(),
        reason: form.reason.trim(),
        expire: form.expire ? dayjs(form.expire).unix() : null
      })
      .then((message) => {
        if (message) {
          notify(message);
        }
        setForm(initialForm);
        setSubmitting(false);
        loadBans();
      })
      .catch((error) => {
        console.error(error);
        setSubmitting(false);
      });
  };

  const handleRemove = (ban) => {
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
          notify(message);
        }
        loadBans();
      })
      .catch(console.error);
  };

  const filteredBans = () => {
    const query = filter.trim().toLowerCase();
    if (!query) {
      return bans;
    }
    return bans.filter((ban) => {
      const mask = (ban.mask || '').toLowerCase();
      const asn = (ban.asn || '').toLowerCase();
      return mask.includes(query) || asn.includes(query);
    });
  };

  const visibleBans = filteredBans();

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
            onChange={(e) => handleFormChange('table', e.target.value)}
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
            onChange={(e) => handleFormChange('target', e.target.value)}
            className='ban-manager__add-target'
          />
          <TextField
            size='small'
            label='Причина'
            value={form.reason}
            onChange={(e) => handleFormChange('reason', e.target.value)}
            className='ban-manager__add-reason'
          />
          <TextField
            size='small'
            type='datetime-local'
            label='Истекает'
            value={form.expire}
            onChange={(e) => handleFormChange('expire', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            className='ban-manager__add-expire'
          />
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAdd}
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
            onChange={(e) => setFilter(e.target.value)}
            className='ban-manager__filter'
          />
          <IconButton onClick={loadBans} title='Обновить'>
            <RefreshIcon />
          </IconButton>
        </div>

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
            {(() => {
              if (loading) {
                return Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: TABLE_COLUMNS }).map((__, cell) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableCell key={`skeleton-cell-${cell}`}>
                        <Skeleton animation='wave' variant='text' />
                      </TableCell>
                    ))}
                  </TableRow>
                ));
              }
              if (visibleBans.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={TABLE_COLUMNS} align='center' className='ban-manager__empty'>
                      Баны не найдены
                    </TableCell>
                  </TableRow>
                );
              }
              return visibleBans.map((ban) => (
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
                      <IconButton size='small' color='error' onClick={() => handleRemove(ban)}>
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ));
            })()}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
