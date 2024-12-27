import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'bloc.dart';
import 'event.dart';
import 'state.dart';

class CoursePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (BuildContext context) => CourseBloc()..add(InitEvent()),
      child: Builder(builder: (context) => _buildPage(context)),
    );
  }

  Widget _buildPage(BuildContext context) {
    final bloc = BlocProvider.of<CourseBloc>(context);

    return DefaultTabController(
      length: 3, // Number of tabs
      child: Scaffold(
        appBar: AppBar(
          title: Container(),
          bottom: TabBar(
            tabs: bloc.state.pages.map((page) =>
                Tab(icon: page.icon, text: page.name)).toList(),
            onTap: (index) {
              bloc.add(SwitchTabEvent(index));
            },
          ),
        ),
        body: BlocBuilder<CourseBloc, CourseState>(
          builder: (context, state) {
            return TabBarView(
              physics: const BouncingScrollPhysics(),
              children: state.pages.map((page) => page.widget).toList(), // Enable swipe gestures
            );
          },
        ),
      ),
    );
  }
}