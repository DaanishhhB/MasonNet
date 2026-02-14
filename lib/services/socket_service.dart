import 'package:socket_io_client/socket_io_client.dart' as io;
import 'api_config.dart';

class SocketService {
  static io.Socket? _socket;

  /// Connect to the Socket.IO server with JWT auth
  static void connect(String token) {
    if (_socket != null) return;

    _socket = io.io(
      ApiConfig.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .disableAutoConnect()
          .build(),
    );

    _socket!.connect();
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
}
