import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeroesService} from '../../services/heroes.service';
import { of, Subscription } from 'rxjs';
import {Hero} from '../../models/hero/hero';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {

  hero!: Hero;
  id!: number | undefined;
  subscribe: Subscription[] = [];

  constructor(public heroesService: HeroesService, private route: ActivatedRoute, private router: Router) {
    this.subscribe.push(
      this.route.params.pipe(
        switchMap((params) => {
          this.id = this.castStringToNumber(params.id);
          return this.id ? this.heroesService.getHero(this.id) : of({} as Hero)
        }),
      ).subscribe((hero) => {
        this.hero = hero;
      })
    );
  }

  ngOnInit(): void {
  }

  castStringToNumber(id: any): number | undefined {
    const cast = Number(id);
    if (!isNaN(cast)) {
      return cast;
    }
    this.router.navigate(['error', 500], {skipLocationChange: true});
    return
  }

  ngOnDestroy(): void {
    this.subscribe.map((sub) => sub.unsubscribe());
  }

}
