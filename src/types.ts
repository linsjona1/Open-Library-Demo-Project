export interface Book {
id: string;
title: string;
author: string;
genre?: string;
filePath: string;
userId: string;
isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
}