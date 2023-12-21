import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/pages/services/auth.service';
import { TransactionService } from 'src/app/pages/services/transaction.service';

import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  segmentValue: string = 'todo';
  historialTransacciones: any[] = [];
  private unsubscribe$ = new Subject<void>();

  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtener el UID del usuario actual desde el servicio de autenticación
    this.authService.userState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user) => {
          if (user) {
            const uidUsuarioActual = user.uid;

            // Llamar a la función getTransactionHistory para obtener el historial de transacciones
            this.transactionService
              .getTransactionHistory(uidUsuarioActual)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (historial) => {
                  console.log('Historial de transacciones recibido:', historial);
                  this.historialTransacciones = historial || [];
                },
                error: (error) => {
                  console.error('Error al obtener el historial de transacciones:', error);
                },
              });
          }
        },
        error: (error) => {
          console.error('Error al obtener el usuario actual:', error);
        },
      });

    // Configurar la búsqueda con debounceTime
    this.setupSearch();
  }
  search() {
    console.log('Realizando búsqueda con término:', this.searchTerm);
    this.transactionService.searchUsersDynamic(this.searchTerm).subscribe(
      (results) => {
        console.log('Resultados de la búsqueda:', results);
        this.searchResults = results;
      },
      (error) => {
        console.error('Error al buscar usuarios:', error);
      }
    );
  }

  segmentChanged() {
    // Lógica para manejar el cambio de segmento (si es necesario)
    console.log('Segment changed:', this.segmentValue);
  }

  private setupSearch() {
    // Configurar la búsqueda dinámica
    this.transactionService
      .searchUsersDynamic(this.searchTerm)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results) => {
        this.searchResults = results;
      });
  }

  // Actualizar la búsqueda cuando se modifica el término de búsqueda
  onSearchTermChange() {
    this.setupSearch();
  }

  getUserDisplayName(uid: string): string {
    const userResult = this.searchResults.find((user) => user.uid === uid);
    return userResult ? userResult.displayName : 'Usuario Desconocido';
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
