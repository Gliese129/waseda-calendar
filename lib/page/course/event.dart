abstract class CourseEvent {}

class InitEvent extends CourseEvent {}

class SwitchTabEvent extends CourseEvent {
  SwitchTabEvent(this.index);

  final int index;
}