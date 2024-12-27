import 'package:flutter/material.dart';
import 'package:uni_life/model/Page.dart';


class CourseState {
  int selectedIndex = 0;
  final List<CustomPage> pages = [
    CustomPage(widget: const Center(child: Text('Sub Home Page')), name: 'Home', icon: Icon(Icons.home)),
    CustomPage(widget: const Center(child: Text('Sub Search Page')), name: 'Search', icon: Icon(Icons.search)),
    CustomPage(widget: const Center(child: Text('Sub Profile Page')), name: 'Profile', icon: Icon(Icons.person)),
  ];

  CourseState init() {
    return CourseState();
  }

  CourseState clone() {
    return CourseState();
  }
}
