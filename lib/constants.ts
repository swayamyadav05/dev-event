export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Conf 2025",
    image: "/images/event1.png",
    slug: "react-conf-2025",
    location: "Las Vegas, Nevada",
    date: "December 10-11, 2025",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Web Summit 2025",
    image: "/images/event2.png",
    slug: "web-summit-2025",
    location: "Lisbon, Portugal",
    date: "November 3-5, 2025",
    time: "10:00 AM - 6:00 PM",
  },
  {
    title: "Node.js Conference Europe",
    image: "/images/event3.png",
    slug: "nodejs-conf-europe",
    location: "Amsterdam, Netherlands",
    date: "October 30 - November 1, 2025",
    time: "8:30 AM - 5:30 PM",
  },
  {
    title: "JavaScript Global Summit",
    image: "/images/event4.png",
    slug: "js-global-summit",
    location: "San Francisco, California",
    date: "January 15-17, 2026",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Tech Hackathon 2025",
    image: "/images/event5.png",
    slug: "tech-hackathon-2025",
    location: "Berlin, Germany",
    date: "November 15-17, 2025",
    time: "12:00 PM - 10:00 PM",
  },
  {
    title: "DevOps Days Conference",
    image: "/images/event6.png",
    slug: "devops-days-conf",
    location: "Toronto, Canada",
    date: "December 2-3, 2025",
    time: "8:00 AM - 4:30 PM",
  },
];
