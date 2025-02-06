interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  }
  
  interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
  }
  
  interface User {
    id: number;
    name: string;
    email: string;
    address: Address;
    company: Company;
  }
  
  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }