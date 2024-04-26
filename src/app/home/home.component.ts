import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap, throttle} from 'rxjs/operators';
import {createHttpObservable} from "../common/util";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>

  advancedCourses$: Observable<Course[]>

    ngOnInit() {

      const http$ = createHttpObservable('/api/courses');

      const courses$: Observable<Course[]> = http$
        .pipe(
          tap(() => console.log("HTTP Request Executed")),
          map(res => Object.values(res["payload"]) ),
          shareReplay(),
          retryWhen(errors => errors
            .pipe(
              delayWhen(() => timer(2000))
            ) )
        );

      this.beginnerCourses$ = courses$
        .pipe(
          map(courses => courses
            .filter(course => course.category == 'BEGINNER'))
          );

      //test

      this.advancedCourses$ = courses$
        .pipe(
          map(courses => courses
            .filter(course => course.category == 'ADVANCED'))
          );

    }
}
