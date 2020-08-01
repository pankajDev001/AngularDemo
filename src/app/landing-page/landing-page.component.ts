import { Component, OnInit, HostListener } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  isSticky: boolean = false;
  collapsed: boolean = false;
  isAgency = '';
  isClinician = '';
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }
  homeSlide: any = [
    {
      src:'assets/images/landing-pgae/Home/Banner-3.png'
    },
    {
      src:'assets/images/landing-pgae/Home/Banner-2.png'
    },
    {
      src:'assets/images/landing-pgae/Home/Banner-6.png'
    },
    {
      src:'assets/images/landing-pgae/Home/Banner-4.png'
    }
  ]
  agencySlide: any = [
    {
      src:'assets/images/landing-pgae/mobile/Agency/1.png',
      icon:'assets/images/landing-pgae/Agency/Simple Sign UP _ then Sign IN.svg',
      title:'Simple Sign UP & then Sign IN',
      desc:'Secured yet simple access with 2 Factor authentication with OTP in-place.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Agency/2.png',
      icon:'assets/images/landing-pgae/Agency/Modify Agency Profile.svg',
      title:'Modify Agency Profile',
      desc:'Modify details of your profile anytime.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Agency/3.png',
      icon:'assets/images/landing-pgae/Agency/Add Patients.svg',
      title:'Add Patients',
      desc:'Add up all the patients to whom you want to provide the treatment or service.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Agency/4.png',
      icon:'assets/images/landing-pgae/Agency/Check Clinicians.svg',
      title:'Check Clinicians',
      desc:'Check the number of clinicians signed-up to system.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Agency/5.png',
      icon:'assets/images/landing-pgae/Agency/Schedule Visit.svg',
      title:'Schedule Visit',
      desc:'Create visits for patient with suitable & nearby clinician as per requirements given by Patient.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Agency/6.png',
      icon:'assets/images/landing-pgae/Agency/Payment Report.svg',
      title:'Payment Report',
      desc:'Track details of payment and all its disbursement regards to visits.'
    }
  ]
  clinicianSlide: any = [
    {
      src:'assets/images/landing-pgae/mobile/Clinician/1.png',
      icon:'assets/images/landing-pgae/Clinicians/Simple Sign UP _ then Sign IN.svg',
      title:'Simple Sign UP & then Sign IN',
      desc:'Secured yet simple access with 2 Factor authentication with OTP in-place.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Clinician/2.png',
      icon:'assets/images/landing-pgae/Clinicians/Modify Clinician Profile.svg',
      title:'Modify Clinician Profile',
      desc:'Modify details of your profile with specifying your coverage area (zipcodes) with service time.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Clinician/3.png',
      icon:'assets/images/landing-pgae/Clinicians/Nearby visits.svg',
      title:'Nearby visits',
      desc:'See the nearby visits of your area and accept the visit request based on your preference & priority.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Clinician/4.png',
      icon:'assets/images/landing-pgae/Clinicians/Accept Visits.svg',
      title:'Accept Visits',
      desc:'Accept or Reject Visits requested by Agency based on your availability.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Clinician/5.png',
      icon:'assets/images/landing-pgae/Clinicians/Check-In _ Check-OUT.svg',
      title:'Check-In & Check-OUT',
      desc:'Once Agency assigned visit to you, start for check-in & then check-out by reaching out to patient for treatment.'
    },
    {
      src:'assets/images/landing-pgae/mobile/Clinician/6.png',
      icon:'assets/images/landing-pgae/Clinicians/Payment Report.svg',
      title:'Payment Report',
      desc:'Track details of payment and all its disbursement for all your visits to know your earnings.'
    }
  ]
  storySlide: any = [
    {
      name:'David J. Figueroas | Agency Person',
      position:'SDC Agency, Physician',
      story: 'It was a great experience of Setting up of Visits for Patient from HomeHealthPro. The USP of the system was the smoothness of the process. We found it very easy to get the visits work done efficiently and fast. David J. Figueroas | Agency Person'
    },
    {
      name:'James Ruzevelt | Agency Person',
      position:'Cure-NCare Agency, Manager ',
      story: 'Considering HomeHealthPro was a best decision, as we have to schedule many visits in a day and handling with the old system was a very cumbersome. HomeHealthPro provided with the feasibility to operate with Clinicians, and now I am able to manage all the visits quite easily. Our Patients response was also very favorable for HomeHealthPro.'
    },
    {
      name:'Darren Shaws | Agency Person',
      position:'CareToHealth Agency, CEO',
      story: 'I would suggest HomeHealthPro to my network agencies also as it had reduced my headache to greater extent. Managing Visits was easier than ever. Patients are happy with the process. Things has speed up and quality also achieved in terms of Management. Thanks to HomeHealthPro.'
    },
    {
      name:'Barbara Johnson | Clinician',
      position:'Psychiatrist & Cardiologist',
      story: 'The experience was very nice working with HomeHealthPro. I did more than 25 Visits till the time, and I am looking for more visits in future. Visit Allocation with Patient and tracking the treatment process was easier compare to all previous process I did. So I am quite enjoying this system.'
    },
     {
      name:'Susan Nelson | Clinician',
      position:'Gynecologist ',
      story: 'Working with HomeHeathPro was a awesome experience. I did get many visits after I followed the process of HomeHeathPro and earned a lot. So the process of Patient treatment was more easier with the way HomeHealthPro operated. So I can recommend this to other clinicians, doctors also...'
    },
    {
      name:'Tara Ellis | Clinician',
      position:'Pediatrician & Surgeon',
      story: 'HomeHealthPro made my work so easier that now I can focus more on the treatment instead of setting up things for Patient and all the payment process. Process of Visit Scheduling and assigning is quite smooth and tracking of all previous Visits make future things easier for me as I could refer the old visits and its details.'
    }
  ]
  homeOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    nav: true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplaySpeed:1500,
    items: 1
  }
  agencyOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    nav: false,
    autoplay:true,
    autoplayTimeout:3000,
    autoplaySpeed:1500,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      601: {
        items: 2
      },
      800: {
        items: 2
      }
    },
  }
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: false
  }
  constructor() { 
    document.body.className = "landing-body";
  }

  ngOnInit() {
  }
  currentSection = 'section1';

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    document.querySelector('#' + section)
    .scrollIntoView({behavior:'smooth'});
    this.collapsed = !this.collapsed;
  }

  overAgency(event){
    this.isAgency = event
  }
  overClinician(event){
    this.isClinician = event
  }

  toggleSidebar(){
    this.collapsed = !this.collapsed
  }
}
