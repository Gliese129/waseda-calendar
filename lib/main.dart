import 'package:flutter/material.dart';
import 'package:uni_life/model/Page.dart';
import 'package:uni_life/page/course/view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Uni Life',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const UniLifeHomePage(title: 'Uni Life Home Page'),
    );
  }
}


class UniLifeHomePage extends StatefulWidget {
  const UniLifeHomePage({super.key, required this.title});

  final String title;

  @override
  State<UniLifeHomePage> createState() => _UniLifeHomePageState();
}

class _UniLifeHomePageState extends State<UniLifeHomePage> {
  int _selectedIndex = 0;


  final List<CustomPage> _pages = [
    CustomPage(widget: CoursePage(), name: 'Home', icon: Icon(Icons.home)),
    CustomPage(widget: Center(child: Text('Search Page')), name: 'Search', icon: Icon(Icons.search)),
    CustomPage(widget: Center(child: Text('Profile Page')), name: 'Profile', icon: Icon(Icons.person)),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: _pages[_selectedIndex].widget,
      bottomNavigationBar: BottomNavigationBar(
        items: _pages.map((page) {
          return BottomNavigationBarItem(
            icon: page.icon,
            label: page.name,
          );
        }).toList(),
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}