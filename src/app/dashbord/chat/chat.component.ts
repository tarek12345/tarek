import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone:false
})
export class ChatComponent implements OnInit {
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


  constructor(
    private apiService: ApiService,
    private chatService: ChatService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    let ref =changes['unreadCountchiled'].currentValue;
        console.log("qsdqdhkqshdkjh",ref)

  }
ngOnInit(): void {
  this.loadCurrentUser(() => {
    // Charger toutes les conversations et les utilisateurs
    this.chatService.getConversations(this.currentUserId).subscribe((convs: any) => {
      this.apiService.getUsersnotpagination().subscribe((res: any) => {
        this.users = res.users
          .filter((u: any) => u.id !== this.currentUserId)
          .map((u: any) => {
            const conv = convs.find((c: any) =>
              (c.user_one_id === this.currentUserId && c.user_two_id === u.id) ||
              (c.user_two_id === this.currentUserId && c.user_one_id === u.id)
            );
            return {
              ...u,
              unreadCount: conv ? conv.unread_count : 0
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
}

refreshChat() {
  console.log("🔄 Refresh chat déclenché" ,this.selectedConversation);
  this.loadCurrentUser();  // recharge l'utilisateur actuel et la liste des utilisateurs
  if (this.selectedConversation) {
    this.loadMessages(this.selectedConversation.id); // recharge les messages si une conversation est ouverte
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
  this.chatService.getConversations(this.currentUserId).subscribe((convs: any) => {
    
    // Associer unread_count à chaque user
    this.apiService.getUsersnotpagination().subscribe((res: any) => {

      this.users = res.users
        .filter((u: any) => u.id !== this.currentUserId)
        .map((u: any) => {
          const conv = convs.find((c: any) =>
            (c.user_one_id === this.currentUserId && c.user_two_id === u.id) ||
            (c.user_two_id === this.currentUserId && c.user_one_id === u.id)
          );
          return {
            ...u,
            unreadCount: conv ? conv.unread_count : 0
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
  user.unreadCount = 0; // localement remettre à zero
});

    this.loadMessages(conv.id);
  });
}


  loadMessages(convId: number) {
    this.chatService.getMessages(convId).subscribe((msgs) => {
      this.messages = msgs;
      this.scrollToBottom();
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
    this.messages.push(msg);

    // reset
    this.newMessage = '';
    this.selectedFile = null;

    this.scrollToBottom();
    this.refreshUnread.emit();
  });
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
}
