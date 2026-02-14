import 'package:flutter_test/flutter_test.dart';
import 'package:masonnet/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MasonNetApp());
    expect(find.text('MasonNet'), findsOneWidget);
  });
}
