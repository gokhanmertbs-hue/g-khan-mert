export interface UserProfile {
  name: string;
  university: string;
  major: string;
  year: string;
  bio: string;
  hobbies: string[];
  lookingFor: string;
  avatar: string;
  gender: string;
  preferredGender: "male" | "female" | "all";
  studentEmail: string;
  studentId: string;
  superLikesLeft: number;
}

export interface MatchUser {
  id: string;
  name: string;
  university: string;
  major: string;
  year: string;
  bio: string;
  hobbies: string[];
  personality: string;
  avatar: string;
  gender: string;
  likesMe: boolean;
  superLikesCount: number;
}

export interface Message {
  id: string;
  sender: "user" | "match";
  text: string;
  timestamp: string;
}

export interface MatchSession {
  matchId: string;
  matchUser: MatchUser;
  messages: Message[];
  unread: boolean;
}

export interface CampusPost {
  id: string;
  authorUniversity: string;
  authorMajor: string;
  text: string;
  timestamp: string;
  likes: number;
  hasLiked: boolean;
  comments: CampusComment[];
}

export interface CampusComment {
  id: string;
  university: string;
  major: string;
  text: string;
  timestamp: string;
}
