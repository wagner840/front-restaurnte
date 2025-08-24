import React from 'react';
import { Button } from '../ui/button';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { LogIn, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ className }) => {
  const { isLoading, error, signIn, signOut, isAuthenticated, user } = useGoogleAuth();

  if (isLoading) {
    return (
      <Button variant="outline" disabled className={className}>
        Carregando...
      </Button>
    );
  }

  if (error) {
    return (
      <Button 
        variant="destructive" 
        onClick={signIn}
        className={className}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Tentar novamente
      </Button>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button 
        onClick={signIn}
        variant="outline"
        className={className}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Conectar Google Calendar
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`${className} flex items-center gap-2`}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="max-w-32 truncate">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};