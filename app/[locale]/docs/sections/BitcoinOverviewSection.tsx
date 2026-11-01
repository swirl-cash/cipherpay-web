'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function BitcoinOverviewSection() {
  return (
    <>
      <SectionTitle>One product direction for Bitcoin</SectionTitle>
      <Paragraph>SWIRL for Bitcoin applies the same product principles used across the project: <Strong>user-held credentials, clear transaction control and privacy without unnecessary identity accounts</Strong>. It is part of SWIRL&apos;s multi-ecosystem architecture, not a separate definition of the project.</Paragraph>
      <Paragraph>Bitcoin and Lightning have different settlement and privacy constraints from EVM. Their implementation therefore uses Bitcoin-specific components rather than pretending that an EVM note or contract can simply be copied onto another network.</Paragraph>

      <SectionDivider />
      <SectionTitle>The current technical building blocks</SectionTitle>
      <Paragraph>The Bitcoin documentation covers silent receiving with BOLT12, blinded paths, pool depth, denomination and timing discipline, channels and submarine settlement. These components address different observers and should be evaluated independently.</Paragraph>
      <Paragraph>The long-term wallet direction is a more consistent experience across Bitcoin and EVM. As that experience evolves, network availability and recovery instructions must be documented for each release rather than inferred from the shared SWIRL brand.</Paragraph>

      <SectionDivider />
      <SectionTitle>Credentials and trust boundaries</SectionTitle>
      <Paragraph>A receipt or other withdrawal credential can be as important as a private key. Losing every copy may make a claim unrecoverable. A coordinator or settlement service can also have route-specific powers and metadata visibility, which the threat model must state plainly.</Paragraph>
      <Callout type="warning">Bitcoin-facing privacy is not automatically identical to EVM privacy. Check the available network, settlement route, credential requirements and recovery procedure for the version you are using.</Callout>
    </>
  );
}
