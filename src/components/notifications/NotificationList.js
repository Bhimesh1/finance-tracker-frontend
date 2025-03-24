import React, { useState, useEffect } from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon, Typography, Divider,
  Box, Badge, IconButton, Popover, Button, CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlagIcon from '@mui/icons-material/Flag';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import { format } from 'date-fns';
import { getUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notificationApi';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'BUDGET_ALERT':
      return <AttachMoneyIcon color="error" />;
    case 'GOAL_DEADLINE':
      return <FlagIcon color="warning" />;
    case 'ACCOUNT_UPDATE':
      return <AccountBalanceIcon color="info" />;
    default:
      return <InfoIcon color="primary" />;
  }
};

const NotificationList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUnreadNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up interval to check for new notifications
    const interval = setInterval(fetchUnreadCount, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    await fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.filter(n => n.id !== id));
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <IconButton
        color="inherit"
        aria-describedby={id}
        onClick={handleClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {notifications.length > 0 && (
              <Button size="small" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
          <Divider />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    alignItems="flex-start"
                    sx={{ 
                      bgcolor: notification.read ? 'transparent' : 'action.hover'
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationList;