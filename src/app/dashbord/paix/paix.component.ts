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
    searchTerm: string = '';
  currentPage: number = 1;
    itemsPerPage: number = 8;
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
displayStyleFiche :string = "none"
  fichepaixselected :any
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
closePopupFiche(){
this.displayStyleFiche = "none"
}
OpenEditFiche(data :  any){
  this.displayStyleFiche = "block";
  this.fichepaixselected =data
  console.log("donne de  listitem fiche   de  paix",this.fichepaixselected)
 
}
  onPay(traite: any) {
    console.log('Payer', traite);
    // appel API pour changer statut ou autre logique
  }


onEdit(): void {
  this.lettreService.EditListPaix(this.fichepaixselected.id,  this.paix).subscribe({
    next: (res) => {
      this.toastr.success("Config paie à jour");
      this.closePopupFiche();
       this.getPaixListByUser()
    },
    error: (err) => {
      this.toastr.error("Erreur lors de la mise à jour", err.message);
    }
  });
}
 // Getter pour filtrer et paginer
get filteredpaix(): any[] {

  let filtered = this.paix || [];

  const search = (this.searchTerm || '').trim().toLowerCase();

  if (search !== '') {

    if (this.userid?.role === 'administrator') {

      // ADMINISTRATEUR :
      // Nom + Prénom + Salaire net + Salaire brut
      filtered = this.paix.filter((p: any) => {

        const nom = String(p.nom || '').toLowerCase();
        const prenom = String(p.prenom || '').toLowerCase();
        const salaireNet = String(p.salaire_net || '').toLowerCase();
        const salaireBrut = String(p.salaire_brut || '').toLowerCase();

        return (
          nom.includes(search) ||
          prenom.includes(search) ||
          salaireNet.includes(search) ||
          salaireBrut.includes(search)
        );
      });

    } else {

      // AUTRE UTILISATEUR :
      // Salaire net + Salaire brut + Date de création
      filtered = this.paix.filter((p: any) => {

        const salaireNet = String(p.salaire_net || '').toLowerCase();
        const salaireBrut = String(p.salaire_brut || '').toLowerCase();
        const createdAt = String(p.created_at || '').toLowerCase();

        return (
          salaireNet.includes(search) ||
          salaireBrut.includes(search) ||
          createdAt.includes(search)
        );
      });
    }
  }

  // Pagination
  const start = (this.currentPage - 1) * this.itemsPerPage;

  return filtered.slice(
    start,
    start + this.itemsPerPage
  );
}
}

