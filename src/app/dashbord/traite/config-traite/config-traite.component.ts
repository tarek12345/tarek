import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { SharedConfigService } from '../../../services/shared-config.service';

@Component({
  selector: 'app-config-traite',
  standalone: false,
  templateUrl: './config-traite.component.html',
  styleUrls: ['./config-traite.component.css']
})
export class ConfigTraiteComponent {
    @Input() userdetaile: any;
    @Input() datauser: any;
      @Output() configUpdated = new EventEmitter<void>(); // 🔹 Événement pour le parent
      allusers: any[] = [];
      userid :any
    fournisseur = '';
  rib = '';
  configs: any[] = [];
  
ngOnChanges(changes: SimpleChanges): void {
  if (changes['userdetaile']) {
    this.allusers = changes['userdetaile']?.currentValue || [];
  }

  if (changes['datauser']) {
    this.userid = changes['datauser']?.currentValue?.user;
  }
}

    constructor(private configtraite: ApiService,    private toastr: ToastrService,private sharedConfig: SharedConfigService ) {}
  
  formDataconfig = {
    nom: '',
    rib: '',
  };
ngOnInit() {
    this.loadConfigs();
  }

  loadConfigs() {
    this.configtraite.getAllConfig().subscribe(data => {
      this.configs = data;
    });
  }

  addConfig() {
    if (!this.fournisseur || !this.rib) return;
    this.configtraite.addConfig({ fournisseur: this.fournisseur, rib: this.rib }).subscribe(() => {
      this.fournisseur = '';
      this.rib = '';
      this.loadConfigs();
      this.sharedConfig.triggerRefresh();
    });
  }

  deleteConfig(id: number) {
    this.configtraite.deleteConfig(id).subscribe(() => {
      this.loadConfigs();
      this.sharedConfig.triggerRefresh();
    });
  }
 


}
