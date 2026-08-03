import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SharedConfigService } from '../../services/shared-config.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-paix',
  standalone: false,

  templateUrl: './paix.component.html',
  styleUrl: './paix.component.css'
})
export class PaixComponent {
  private sub!: Subscription;
  @Input() userdetaile: any;
  @Input() datauser: any;
  allusers: any[] = [];
  users: any
  userid: any
  paix: any[] = [];
  total: number = 0;
  loading = true;
  public apiUrl = environment.baseUrl; // Base URL de l'API

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['userdetaile']) {

      this.allusers = changes['userdetaile']?.currentValue;

    }
    else {
      this.userid = changes['datauser']?.currentValue?.user

      if (this.userid?.role == 'administrator') {
        this.getPaixList()
      }
      else {
        this.getPaixListByUser()
      }

    }
  }
  ngOnInit(): void {
    this.sub = this.sharedConfig.refresh$.subscribe(refresh => {
      if (refresh) {
        this.getPaixListByUser(); // 🔹 recharge la liste
      }

    });
  }

  isDepassee(dateEcheance: string): boolean {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    return echeance < today;
  }
  getAlerteType(dateEcheance: string): 'depassee' | 'derniere' | null {
    const today = new Date();
    const echeance = new Date(dateEcheance);

    const todayStr = today.toISOString().split('T')[0];
    const echeanceStr = echeance.toISOString().split('T')[0];

    if (echeanceStr < todayStr) return 'depassee';
    if (echeanceStr === todayStr) return 'derniere';
    return null;
  }


  getUserId(): number | null {
    if (Array.isArray(this.userdetaile)) {

      return this.userdetaile[0]?.id || null; // si tableau
    } else {
      return this.userdetaile?.id || null; // si objet
    }
  }


  constructor(private lettreService: ApiService, private toastr: ToastrService, private sharedConfig: SharedConfigService) { }

  getPaixListByUser() {


    if (this.userid?.id) {


      this.lettreService
        .getPaixListByUser(this.userid.id)
        .subscribe({

          next: (res: any) => {

            this.paix = res.paies;

            this.total = res.total;

            this.loading = false;


          },


          error: (error) => {

            console.error(
              "Erreur récupération paies",
              error
            );

            this.loading = false;

          }


        });


    }


  }


  getPaixList() {

    this.lettreService.getPaixList().subscribe({

      next: (res: any) => {


        this.paix = res.paies;

        this.total = this.paix.length;

        this.loading = false;


      },


      error: (err) => {

        console.error(
          "Erreur récupération paies",
          err
        );

        this.loading = false;

      }


    });


  }

  onEdit(traite: any) {
    console.log('Modifier', traite);
    // ouvrir modal ou naviguer vers le formulaire
  }
onDelete(paix:any):void{


if(confirm(
'Voulez-vous supprimer cette fiche de paie ?'
)){


this.lettreService
.DeletePaix(paix.id)
.subscribe({

next:()=>{


this.paix =
this.paix.filter(
p=>p.id !== paix.id
);


this.total=this.paix.length;


this.toastr.success(
'Fiche de paie supprimée'
);


},


error:()=>{

this.toastr.error(
"Erreur suppression"
);

}


});


}


}
  onPay(traite: any) {
    console.log('Payer', traite);
    // appel API pour changer statut ou autre logique
  }




}

