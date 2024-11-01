import {Component, OnInit} from '@angular/core';
import { environment } from "../../environments/environment";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
export interface Video {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
}
@Component({
  selector: 'app-instagram-feed',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './instagram-feed.component.html',
  styleUrl: './instagram-feed.component.css'
})
export class InstagramFeedComponent implements OnInit {
  cdnUrl = environment.baseCdnUrl;
  private accessToken = environment.instagramAccessToken;
  private userId = environment.instagramUserId;
  private apiUrl = `https://graph.instagram.com/me/media?fields=${this.userId},caption,media_type,media_url,permalink&access_token=${this.accessToken}&limit=3`;
  media: Observable<any> | undefined

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.media = this.fetchVideos();
  }
  fetchVideos(): Observable<Video[]> {
    return this.http.get<{data: Video[]}>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }


}
