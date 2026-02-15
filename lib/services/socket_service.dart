import 'package:socket_io_client/socket_io_client.dart' as io;
import 'api_config.dart';

class SocketService {
  static io.Socket? _socket;

  /// Connect to the Socket.IO server with JWT auth
  static void connect(String token) {
    if (_socket != null) {
      // If already connected, just ensure it's connected
      if (!_socket!.connected) _socket!.connect();
      return;
    }

    _socket = io.io(
      ApiConfig.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableReconnection()
          .build(),
    );

    _socket!.onConnect((_) {
      // Auto-join the feed room on connect
      _socket?.emit('join-feed');
    });

    _socket!.onReconnect((_) {
      _socket?.emit('join-feed');
    });
  }

  /// Disconnect from the server
  static void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }

  /// Join a channel room to receive real-time channel messages
  static void joinChannel(String channelId) {
    _socket?.emit('join-channel', channelId);
  }

  /// Leave a channel room
  static void leaveChannel(String channelId) {
    _socket?.emit('leave-channel', channelId);
  }

  /// Listen for new channel messages
  static void onChannelMessage(void Function(dynamic) callback) {
    _socket?.on('new-channel-message', callback);
  }

  /// Stop listening for channel messages
  static void offChannelMessage(void Function(dynamic) callback) {
    _socket?.off('new-channel-message', callback);
  }

  /// Listen for new DMs
  static void onDm(void Function(dynamic) callback) {
    _socket?.on('new-dm', callback);
  }

  /// Stop listening for DMs
  static void offDm(void Function(dynamic) callback) {
    _socket?.off('new-dm', callback);
  }

  /// Listen for new feed posts
  static void onNewPost(void Function(dynamic) callback) {
    _socket?.on('new-post', callback);
  }

  /// Stop listening for new feed posts
  static void offNewPost(void Function(dynamic) callback) {
    _socket?.off('new-post', callback);
  }

  /// Listen for post updates (likes, etc.)
  static void onPostUpdated(void Function(dynamic) callback) {
    _socket?.on('post-updated', callback);
  }

  /// Stop listening for post updates
  static void offPostUpdated(void Function(dynamic) callback) {
    _socket?.off('post-updated', callback);
  }
}
