# Hyperliquid Spot Trading Boilerplate

A Next.js-based boilerplate for building decentralized spot trading applications on Hyperliquid. This project provides a foundation for creating web3 trading interfaces with essential features like wallet connection, builder fee approval, agent creation, and gas-free order execution.

## Features

- 🔐 Secure wallet connection using AppKit
- 💱 Spot trading interface for buying and selling tokens
- 🤝 Builder fee approval system
- 🔑 Agent-based trading system
- 🎨 Modern UI using shadcn/ui components
- 🌙 Dark mode support
- 🔄 Real-time price and balance updates

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**:
  - Wagmi
  - Viem
  - Ethers.js
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```env
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_RPC_URL=your_rpc_url
NEXT_PUBLIC_BUILDER_ADDRESS=your_builder_address
NEXT_PUBLIC_BUILDER_FEE=your_builder_fee
```

4. Run the development server:

```bash
pnpm dev
```

## Core Components

### Wallet Connection

The wallet connection is handled through AppKit integration, providing a seamless connection experience:

```typescript:src/components/ConnectWallet.tsx
startLine: 9
endLine: 24
```

### Trading Interface

The trading interface supports both buying and selling with features like:

- Current token price
- Balance checking
- Slippage control
- Order execution

### Builder Fee Approval

Users need to approve builder fees before trading:

```typescript:src/components/ApproveBuilderFee.tsx
startLine: 17
endLine: 61
```

### Agent System

The platform uses an agent-based system for gas-free trading:

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or reach out to the Hyperliquid community.
