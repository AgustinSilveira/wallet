import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/services/auth.service';
import { TransactionService } from 'src/app/pages/services/transaction.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { SharedDataQRService } from 'src/app/shared/shared-dataQR.service';


@Component({
  selector: 'app-pay-resumen',
  templateUrl: './pay-resumen.component.html',
  styleUrls: ['./pay-resumen.component.scss'],
})
export class PayResumenComponent implements OnInit {
  userName: string = "Invitado";
  photo: string = "";
  monto: number = 0;
  qrData: { user: string; monto: number; mensaje: string; payTransaction: string } | null = null;
  comisionActivada: boolean = true;
  montoOriginal: number = 0;
  comisionCalculada: number = 0;
  remitenteUid: string | null = null;
  destinatarioUid: string | null = null;

  

  // qrData: { user: string; monto: number; mensaje: string; payTransaction: string } = {
  //   user: '',
  //   monto: 0,
  //   mensaje: '',
  //   payTransaction: '',
  // }

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Salir',
      role: 'confirm',
      handler: () => {
        this.router.navigate(['/wallet']);
      },
    },
  ];




  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedDataService: SharedDataService,
    public sharedDataQR: SharedDataQRService,
    private cdr: ChangeDetectorRef,
    private transactionService: TransactionService
  ) {

  }



  toggleComision() {
    // Cambiar el estado de la comisión
    this.comisionActivada = !this.comisionActivada;

    // Actualizar la comisión según el estado de la comisión
    if (this.comisionActivada) {
      // Si la comisión está activada, calcular la comisión
      this.comisionCalculada = this.monto * 0.0112;
    } else {
      // Si la comisión está desactivada, restablecer la comisión
      this.comisionCalculada = 0;
    }

    // Restaurar el monto original
    this.monto = this.montoOriginal + this.comisionCalculada;
  }




  ngOnInit() {
    
    this.authService.userState$.subscribe(user => {
      if (user) {
        // Almacena el UID del remitente en una propiedad del componente
        this.remitenteUid = user.uid;
      }
    });



    this.sharedDataQR.getQRData().subscribe((qrData) => {
      console.log('QR Data in pay-resumen:', qrData);
      if (qrData) {
        this.destinatarioUid = qrData.user; 
        this.montoOriginal = qrData.monto || 0;
        this.monto = this.comisionActivada ? this.montoOriginal + this.comisionCalculada : this.montoOriginal;
        this.cdr.detectChanges();
      }
    });


    this.authService.userState$.subscribe(user => {
      if (user) {
        this.userName = user.displayName || "Invitado";
        this.photo = user.photoURL || "";
      } else {
        this.userName = "Invitado";
      }
    });
  }

  confirmPayment() {
    // Verificar que remitenteUid y destinatarioUid no sean nulos antes de intentar la transferencia
    if (this.remitenteUid === null || this.destinatarioUid === null) {
      console.error('UID del remitente o destinatario es nulo. No se puede realizar la transferencia.');
      return;
    }

    // Obtén la información necesaria para la transferencia desde los servicios compartidos
    const remitenteUid = this.remitenteUid;
    const destinatarioUid = this.destinatarioUid; // Modifica esta línea
    const amount = this.monto;

    // Realiza la transferencia de fondos
    this.transactionService.transferFunds(remitenteUid, destinatarioUid, amount)
      .subscribe({
        next: () => {
          console.log('Transferencia exitosa');
          // Aquí podrías realizar otras acciones después de una transferencia exitosa

          // Redirige a la página de inicio después de una transferencia exitosa
          this.router.navigate(['/wallet']);
        },
        error: (error: any) => {
          console.error('Error en la transferencia:', error);
          // Aquí podrías manejar el error de la transferencia
        }
      });
  }

}
