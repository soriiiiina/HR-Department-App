import { Component, OnInit } from '@angular/core';
import { CardChartData } from 'src/app/_models/card-chart-data';
import { Member } from 'src/app/_models/member';
import { PieChartData } from 'src/app/_models/piechart-data';
import { DashboardService } from 'src/app/_services/dashboard.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit {
  ageChart: PieChartData[] = []
  ageChartCalcOver: Boolean = false;
  facultyChart: PieChartData[] = [];
  facultyChartCalcOver: Boolean = false;
  members!: Member[];
  cards = [71, 78, 13, 39, 66];
  currentDate!: Date;
  memberCurrYear!: CardChartData;
  memberCurrMonth!: CardChartData;
  hrMemberCurrYear!: CardChartData;
  hrMemberCurrMonth!: CardChartData;
  cardChartCalcOver: Boolean = false;
  displayedColumns: string[] = ['id', 'fullName', 'faculty', 'age'];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.currentDate = new Date(Date.now());
    this.dashboardService.getMembers()
    .subscribe((result) => {
      this.members = result;
      this.calcAgeData();
      this.calcFacultyData();
      this.calcChartData();
    });
  }

  calcAgeData(): void {
    this.members.map((m) => {
      this.ageChart[m.age] = this.ageChart[m.age] 
        ? {...this.ageChart[m.age], y: this.ageChart[m.age].y + 1}
        : {name: m.age.toString() + " years", y: 1};
    })
    this.ageChart = this.ageChart.filter(n => n);
    this.ageChart[0] = {...this.ageChart[0], sliced: true, selected: true}
    this.ageChartCalcOver = true;
  }

  calcFacultyData(): void {
    const map = new Map();
    this.members.map((m) => {
      map.set(
        m.faculty,
        {
          name: m.faculty,
          y: map.has(m.faculty) ? map.get(m.faculty).y + 1 : 1
        }
      )
    })
    const keys = [...map.keys()]
    keys.map((key, index) => {
      this.facultyChart[index] = map.get(key);
    })
    this.facultyChart[0] = {...this.facultyChart[0], sliced: true, selected: true};
    this.facultyChartCalcOver = true;
  }

  calcChartData(): void {
    const total = this.members
      .filter(m => new Date(m.created).getFullYear() === this.currentDate.getFullYear())
      .length

    const data: number[] = [];
    for(let i = this.currentDate.getFullYear() - 4; i <= this.currentDate.getFullYear(); i++){
      const yearly = this.members
      .filter(m => new Date(m.created).getFullYear() === i)
      .length

      data[i - this.currentDate.getFullYear() + 4] = Number.parseInt((yearly * 100 / this.members.length).toFixed())
    }

    this.memberCurrYear = {
      label: 'New members in ' + this.currentDate.getFullYear().toString(),
      total: total.toString(),
      percentage: (total * 100 / this.members.length).toFixed().toString(),
      data: data,
      limit: `${this.members.length} members`,
    }

    // 1

    const total1 = this.members
      .filter(m => new Date(m.created).getMonth() === this.currentDate.getMonth() && new Date(m.created).getFullYear() === this.currentDate.getFullYear())
      .length

    const data1: number[] = [];
    for(let i = this.currentDate.getMonth() - 4; i <= this.currentDate.getMonth(); i++){
      const yearly = this.members
      .filter(m => new Date(m.created).getMonth() === i && new Date(m.created).getFullYear() === this.currentDate.getFullYear())
      .length

      data1[i - this.currentDate.getMonth() + 4] = Number.parseInt((yearly * 100 / this.members.length).toFixed())
    }

    this.memberCurrMonth = {
      label: 'New members in ' + this.currentDate.toLocaleString('default', {month: 'long'}),
      total: total1.toString(),
      percentage: (total1 * 100 / this.members.length).toFixed().toString(),
      data: data1,
      limit: `${this.members.length} members`
    }

    // 2

    const total2 = this.members
      .filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin"))
      .filter(m => new Date(m.created).getFullYear() === this.currentDate.getFullYear())
      .length

    const data2: number[] = [];
    for(let i = this.currentDate.getFullYear() - 4; i <= this.currentDate.getFullYear(); i++){
      const yearly = this.members
      .filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin"))
      .filter(m => new Date(m.created).getFullYear() === i)
      .length

      data2[i - this.currentDate.getFullYear() + 4] = Number.parseInt((yearly * 100 / this.members.filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin")).length).toFixed())
    }

    this.hrMemberCurrYear = {
      label: 'HR members in ' + this.currentDate.getFullYear().toString(),
      total: total2.toString(),
      percentage: (total2 * 100 / this.members.filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin")).length).toFixed().toString(),
      data: data2,
      limit: `${this.members.filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin")).length} HR members`
    }

    // 3

    const total3 = this.members
      .filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin"))
      .filter(m => new Date(m.created).getMonth() === this.currentDate.getMonth() && new Date(m.created).getFullYear() === this.currentDate.getFullYear())
      .length

    const data3: number[] = [];
    for(let i = this.currentDate.getMonth() - 4; i <= this.currentDate.getMonth(); i++){
      const yearly = this.members
      .filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin"))
      .filter(m => new Date(m.created).getMonth() === i && new Date(m.created).getFullYear() === this.currentDate.getFullYear())
      .length

      data3[i - this.currentDate.getMonth() + 4] = Number.parseInt((yearly * 100 / this.members.filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin")).length).toFixed())
    }

    this.hrMemberCurrMonth = {
      label: 'HR members in ' + this.currentDate.toLocaleString('default', {month: 'long'}),
      total: total3.toString(),
      percentage: (total3 * 100 / this.members.filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin")).length).toFixed().toString(),
      data: data3,
      limit: `${this.members.filter(m => m.roles?.includes("TeamMember") || m.roles?.includes("Admin")).length} HR members`
    }
    
    this.cardChartCalcOver = true;
  }

}
