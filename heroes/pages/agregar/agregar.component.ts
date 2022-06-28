import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Heroe, Publisher } from '../../interfaces/heroes.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img{
      width: 100%;
      border-radius: 5px;
    }
  `
  ]
})

export class AgregarComponent implements OnInit {

  publishers = [
    {
      id:'DC Comics',
      desc:'DC - Comics'
    },
    {
      id:'Marvel Comics',
      desc:'Marvel - Comics'
    }
  ];
heroe: Heroe = {
  superhero: '',
  alter_ego: '',
  characters: '',
  first_appearance: '',
  publisher: Publisher.DCComics,
  alt_img: ''
}

  constructor(private herosService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    if(!this.router.url.includes('editar')){
      return;
    }

    this.activatedRoute.params.pipe(
      switchMap( ({id}) => this.herosService.getHeroePorId(id))
    )
    .subscribe(heroe => this.heroe = heroe);
  }

  guardar(){
    if(this.heroe.superhero.trim().length === 0){
      return;
    }
    if (this.heroe.id) {
      this.herosService.actualizarHeroe(this.heroe).subscribe(
        resp => {
          console.log('Actualizando Heroe', resp);
          this.mostrarSnackBar('Registro Actualizado');
        }
      );
    } else {
      this.herosService.agregarHeroe(this.heroe).subscribe(
        resp => {
          console.log('Agregando Heroe', resp);
          this.mostrarSnackBar('Registro Creado');
          this.router.navigate(['/heroes/editar', resp.id]);
          
        }
      );
    }
  }

  borrarHeroe(){
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if (result){
          this.herosService.eliminarHeroe(this.heroe.id!)
            .subscribe(resp => {
              this.router.navigate(['heroes']);
            });
        }
      }
    );

  }

  mostrarSnackBar(mensaje: string){
    this._snackBar.open(mensaje, 'ok!', {
      duration: 2000
    });
  }
}
