// app.component.ts
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Replace this URL with the actual URL where your Flask server is running
  dashAppUrl: string = 'http://localhost:1118';

  // Safe URL to prevent security errors
  safeDashAppUrl!: SafeResourceUrl; // Add the "!" to indicate it will be initialized

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Sanitize the URL
    this.safeDashAppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dashAppUrl);
  }

  getSafeUrl(): SafeResourceUrl {
    return this.safeDashAppUrl;
  }
}
