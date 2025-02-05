import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-geolocation',
  standalone: false,
  
  templateUrl: './geolocation.component.html',
  styleUrl: './geolocation.component.css'
})
export class GeolocationComponent implements OnInit {
  @Input() localisation : any;
  
  latitude: number | null = null;
  longitude: number | null = null;
  address: string = 'Adresse non disponible';

  constructor() { }
  
  ngOnInit(): void {
    console.log('loooooooooooooooooooooog',this.localisation)
    // if (this.localisation) {
    //   console.log("📌 Localisation brute :", this.localisation);  // Vérifie la chaîne de localisation
    //   this.extractCoordinates(this.localisation);
    // } else {
    //   console.warn("⚠️ Aucune donnée de localisation disponible.");
    // }
  }
  

  // extractCoordinates(location: string) {
  
  // }
  

  // getAddress(lat: number, lon: number) {
  //   const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

  //   console.log("🌍 Requête API :", url); // Vérifie si la requête est bien envoyée

  //   fetch(url)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log("📩 Réponse API :", data); // Vérifie la réponse de l'API
  //       if (data.address) {
  //         this.address = this.formatAddress(data.address);
  //       } else {
  //         console.warn("⚠️ Aucune adresse trouvée.");
  //         this.address = 'Adresse non trouvée';
  //       }
  //     })
  //     .catch(error => console.error('❌ Erreur API OpenStreetMap :', error));
  // }

  // formatAddress(address: any): string {
  //   let formattedAddress = '';

  //   if (address.house_number) {
  //     formattedAddress += `${address.house_number}, `;
  //   }
  //   if (address.road) {
  //     formattedAddress += `${address.road}, `;
  //   }
  //   if (address.suburb) {
  //     formattedAddress += `${address.suburb}, `;
  //   }
  //   if (address.city) {
  //     formattedAddress += `${address.city}, `;
  //   }
  //   if (address.state) {
  //     formattedAddress += `${address.state}, `;
  //   }
  //   if (address.country) {
  //     formattedAddress += `${address.country}`;
  //   }

  //   return formattedAddress || 'Adresse non trouvée';
  // }
}