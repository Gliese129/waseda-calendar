import 'package:bloc/bloc.dart';

import 'event.dart';
import 'state.dart';

class CourseBloc extends Bloc<CourseEvent, CourseState> {
  CourseBloc() : super(CourseState().init()) {
    on<InitEvent>(_init);
  }

  void _init(InitEvent event, Emitter<CourseState> emit) async {
    emit(state.clone());
  }

  @override
  Stream<CourseState> mapEventToState(CourseEvent event) async* {
    if (event is SwitchTabEvent) {
      yield state.clone()
              ..selectedIndex = event.index;
    } else if (event is InitEvent) {
      yield state.clone();
    }
  }
}
