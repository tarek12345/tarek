import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone:false
})
export class ChatComponent implements OnInit,OnDestroy  {
  @Output() refreshUnread = new EventEmitter<void>();

  
@Input() unreadCountchiled : any
  currentUser: any = null;
  currentUserId: number = 0;
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';
  searchText: string = '';
//  @Input() user: any;   
private intervalId: any;
private isLoadingMessages = false;
  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
        private toastr: ToastrService
    
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    let ref =changes['unreadCountchiled'].currentValue;

  }
ngOnInit(): void {
  this.loadCurrentUser(() => {
    // Charger toutes les conversations et les utilisateurs
    this.chatService.getConversations(this.currentUserId).subscribe((convs: any) => {
      this.apiService.getUsersnotpagination().subscribe((res: any) => {
this.users = res.users.map((u: any) => {
  const conv = convs.find((c: any) =>
    (c.user_one_id === this.currentUserId && c.user_two_id === u.id) ||
    (c.user_two_id === this.currentUserId && c.user_one_id === u.id)
  );

  return {
    ...u,
    unreadCount: conv ? conv.unread_count : 0,
    isCurrentUser: u.id === this.currentUserId
  };
});

        this.filteredUsers = this.users;

        // 🔥 Ouvrir automatiquement la dernière conversation
        if (convs.length > 0) {
          const lastConv = convs[0];
          const partnerId = (lastConv.user_one_id === this.currentUserId)
            ? lastConv.user_two_id
            : lastConv.user_one_id;
          const partner = this.users.find(u => u.id === partnerId);
          if (partner) {
            this.startConversation(partner);
          }
        }
      });
    });
  });
  // this.intervalId = setInterval(() => {
  //  this.refreshUnread.emit();
  //   if(this.selectedConversation){
  //      this.loadMessages(this.selectedConversation.id);
  //   }


  // },10000);
}
ngOnDestroy(){

 if(this.intervalId){
   clearInterval(this.intervalId);
 }

}
refreshChat() {
  this.loadCurrentUser(); 
  if (this.selectedConversation) {
    this.loadMessages(this.selectedConversation.id); 
  }
}
loadCurrentUser(callback?: Function) {
  this.apiService.getAuthenticatedUser().subscribe((res) => {
    this.currentUser = res;
    this.currentUserId = res.id;
    this.loadAllUsers();

    if (callback) callback();
  });
}
loadLastConversation() {
  this.chatService.getConversations(this.currentUserId).subscribe((convs: any) => {
    
    if (convs.length === 0) return;

    // 🔥 Dernière conversation (car triée dans le backend)
    const lastConv = convs[0]; 

    // Déterminer l’autre user
    const partnerId = (lastConv.user_one_id === this.currentUserId)
      ? lastConv.user_two_id 
      : lastConv.user_one_id;

    const partner = this.users.find(u => u.id === partnerId);

    if (partner) {
      this.startConversation(partner);
    }
  });
}


loadAllUsers() {
  this.chatService.getConversations(this.currentUserId)?.subscribe((convs: any) => {
    
    // Associer unread_count à chaque user
    this.apiService.getUsersnotpagination().subscribe((res: any) => {

      // this.users = res.users
      //   .filter((u: any) => u.id !== this.currentUserId)
      //   .map((u: any) => {
      //     const conv = convs.find((c: any) =>
      //       (c.user_one_id === this.currentUserId && c.user_two_id === u.id) ||
      //       (c.user_two_id === this.currentUserId && c.user_one_id === u.id)
      //     );
      //     return {
      //       ...u,
      //       unreadCount: conv ? conv.unread_count : 0
      //     };
      //   });
this.users = res.users.map((u: any) => {
  const conv = convs.find((c: any) =>
    (c.user_one_id === this.currentUserId && c.user_two_id === u.id) ||
    (c.user_two_id === this.currentUserId && c.user_one_id === u.id)
  );

  return {
    ...u,
    unreadCount: conv ? conv.unread_count : 0,
    isCurrentUser: u.id === this.currentUserId
  };
});
      this.filteredUsers = this.users;
    });

  });
}

  searchUsers() {
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }



startConversation(user: any) {

  this.selectedUser = user;

  this.chatService.startConversation({
    user_one_id: this.currentUserId,
    user_two_id: user.id
  }).subscribe((conv: any) => {

    this.selectedConversation = conv;

    this.chatService.markAsRead(conv.id, this.currentUserId).subscribe(() => {
      this.refreshUnread.emit(); 
      user.unreadCount = 0;
    });

    this.loadMessages(conv.id);
  });
}


loadMessages(convId: number) {

  if (this.isLoadingMessages) {
    return;
  }

  this.isLoadingMessages = true;

  this.chatService.getMessages(convId).subscribe({
next: (msgs) => {

  this.messages = msgs.map((m: any) => ({
    ...m,
    sender_id: Number(m.sender_id)
  }));

  this.scrollToBottom();
},
    error: () => {
      this.isLoadingMessages = false;
    },
    complete: () => {
      this.isLoadingMessages = false;
    }
  });

}

  formatTime(date: string) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

sendMessage() {
  if (!this.newMessage.trim() && !this.selectedFile) return;

  const formData = new FormData();
  formData.append('conversation_id', this.selectedConversation.id);
  formData.append('sender_id', this.currentUserId.toString());

  if (this.newMessage.trim()) {
    formData.append('message', this.newMessage.trim());
  }

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

this.chatService.sendMessage(formData).subscribe((msg: any) => {

  msg.sender_id = Number(msg.sender_id);

  this.messages.push(msg);

  this.newMessage = '';
  this.selectedFile = null;

  this.scrollToBottom();
  this.refreshUnread.emit();
});
}
isMyMessage(message: any): boolean {
  return Number(message.sender_id) === Number(this.currentUserId);
}
  scrollToBottom() {
    setTimeout(() => {
      const list = document.querySelector('.messages');
      if (list) list.scrollTop = list.scrollHeight;
    }, 50);
  }

  showEmoji = false;

toggleEmoji() {
  this.showEmoji = !this.showEmoji;
}

addEmoji(emoji: string) {
  this.newMessage += emoji;
  this.showEmoji = false;
}
selectedFile: File | null = null;


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}

sendFile() {
  if (!this.selectedFile || !this.selectedConversation) return;

  const formData = new FormData();
  formData.append('conversation_id', this.selectedConversation.id);
  formData.append('sender_id', this.currentUserId.toString());
  formData.append('file', this.selectedFile);

  this.chatService.sendFile(formData).subscribe((msg: any) => {
    this.messages.push(msg);
    this.selectedFile = null;
    this.scrollToBottom();
    this.refreshUnread.emit();
  });
}


deleteMessage(message: any | undefined) {

  if (message === undefined) {
    this.toastr.error('Message introuvable.', 'Erreur');
    return;
  }

  this.chatService.deleteMessage(
    message.id,
    this.currentUser.id
  ).subscribe({

    next: (response) => {

      // Supprimer le message de la liste
      this.messages = this.messages.filter(
        m => m.id !== message.id
      );

      // Toast succès
      this.toastr.success(
        'Message supprimé avec succès.',
        'Succès'
      );
    },

    error: (error) => {

      console.error('Erreur suppression message:', error);

      if (error.status === 403) {

        this.toastr.error(
          'Vous ne pouvez supprimer que vos propres messages.',
          'Accès refusé'
        );

      } else if (error.status === 404) {

        this.toastr.error(
          'Message introuvable.',
          'Erreur'
        );

      } else {

        this.toastr.error(
          'Erreur lors de la suppression du message.',
          'Erreur'
        );
      }
    }
  });
}
  
}
