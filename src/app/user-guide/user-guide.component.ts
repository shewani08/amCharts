import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.css']
})
export class UserGuideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  downloadPdf() {
    const doc = new jsPDF();

    // Optionally, you can use HTML content to generate the PDF
    // For complex layouts, it's better to manually set the content using jsPDF's API
    doc.text("User Guide Manual", 10, 10);
    // Add more content here...

    // Save the PDF
    doc.save('UserGuide.pdf');
  }
}
