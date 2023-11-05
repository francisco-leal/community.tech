# community.tech - ETH Lisbon 2023

## Description of the project

The dream of DAOs being as simple as “a group chat with a bank account” remains largely unfulfilled today, mostly because the effort to participate in a DAO is much higher than the benefit of belonging to one.

But what if participating in a DAO was as easy as chatting on Telegram? With the latest advances in infrastructure it can.

Enter community.tech, a marketplace to invest in your favorite online communities. It combines the power of financial incentives with the simplicity of a Telegram chat.

How it works:

Sign-up with your favorite platform (google, apple, …) and connect your Telegram.
Buy a key to access a community’s private telegram chat or buy multiple keys to level up to exclusive tiers.
Trading fees go into a community treasury, and admins can customize the fee percentage.
community.tech drastically lowers entry barriers, allowing anyone to invest and participate in the communities they care about, aligning personal and collective interests. Forget DAOs, with community.tech you can invest in any type of community.

## Links

- CoreDAO Contract Address: 0x664d86CF8D30EEC4169393a70EB3aa796BE85642 [link](https://scan.test.btcs.network/address/0x664d86cf8d30eec4169393a70eb3aa796be85642)

Gnosis Contract Address: 0x4275854fDEF5EE848a2F9F9e10f17119E285A498 [link](https://gnosisscan.io/address/0x4275854fDEF5EE848a2F9F9e10f17119E285A498) [tweet](https://x.com/Francisco__Leal/status/1721107369814327582?s=20)

NeonEVM Contract Address: 0x0846c393EBDA7214be271A3C2Ddc63B77ffDA7bd [link](https://devnet.neonscan.org/address/0x0846c393EBDA7214be271A3C2Ddc63B77ffDA7bd)

Polyon zkEVM Address: 0x0846c393EBDA7214be271A3C2Ddc63B77ffDA7bd [link](https://testnet-zkevm.polygonscan.com/address/0x0846c393EBDA7214be271A3C2Ddc63B77ffDA7bd)

Website: https://community-tech.vercel.app/

Backend: https://community-tech-18fca1125fa3.herokuapp.com/

## How to run

### Backend

- `cd backend`
- `bundle install`
- `bin/rails db:create db:migrate`
- `be rails s -p 3001`

### Frontend

- `cd frontend`
- `npm install`
- `npm run dev`
