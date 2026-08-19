import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ExampleDatapoint} from '../../interfaces/example-datapoint';
import {PeopleDemoService} from '../../services/people-demo-service';
import {HttpResponse} from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-example-page',
  imports: [
    MatTableModule
  ],
  templateUrl: './example-page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './example-page.scss'
})
export class ExamplePage implements OnInit {
  displayedColumns = ['id', 'name', 'color', 'age'];
  people: ExampleDatapoint[] = [];
  private peopleDemoService = inject(PeopleDemoService);

  ngOnInit(): void {
    this.fetchPeople();
  }

  fetchPeople(): void {
    this.peopleDemoService.getPeople().subscribe({
      next: (response: HttpResponse<ExampleDatapoint[]>) => {
        if (response.status === 200 && response.body) {
          this.people = response.body;
        }
      }
    })
  }
}
