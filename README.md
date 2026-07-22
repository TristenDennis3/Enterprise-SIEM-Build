# Enterprise SIEM Network

A fully segmented, air-gapped Security Information and Event Management (SIEM) lab — designed, built, and documented from the ground up. Four isolated VLANs, dual SIEM platforms, live adversary emulation, and custom detection engineering.

**Live site:** https://tristendennis3.github.io/Enterprise-SIEM-Build/

## Overview

This project is a working model of an enterprise Security Operations Center. It simulates attacks against a segmented network and detects them across both network and host sensors. It doubles as a hands-on learning resource for cybersecurity students.

## What's inside

- **Segmented network** — four isolated VLANs (management, SIEM, victim, attack) enforced at the firewall and switch level, with a SPAN mirror feeding the SIEM.
- **Dual SIEM platforms** — Security Onion (network detection via Suricata and Zeek) and Wazuh (host detection via agents), for layered coverage.
- **Vulnerability management** — credentialed and non-credentialed Nessus scans with CVSS-based prioritization.
- **Adversary emulation** — MITRE Caldera and manual attacks (impacket, Hydra, Metasploit) against an Active Directory domain and vulnerable hosts.
- **Custom detection engineering** — custom Wazuh rules written and validated by running the matching attack.

## Attacks and detections

Ten attacks executed and detected, mapped to MITRE ATT&CK — including Kerberoasting, DCSync, pass-the-hash, SQL injection, XSS, command injection, RDP brute force, and a ProFTPD exploit. Each attack is documented with the exact command, target, and the sensor that caught it. See the Attacks page on the live site.

## Custom detection rules

Custom Wazuh rules including Kerberoasting detection (RC4 service tickets), attack-subnet authentication, machine-account noise suppression, and brute-force correlation. Each rule is documented with its config and validation. See the Detection Rules page.

## Tech stack

pfSense (Netgate), UniFi, Proxmox, Active Directory, Security Onion, Suricata, Zeek, Wazuh, Nessus, Kali Linux, MITRE Caldera, Sliver C2, Hydra, Wireshark, Metasploitable3, DVWA.

## Documentation

Written investigations, case studies, configuration docs, and reports are included in this repository and linked from the Documentation page on the site.

---

Designed, built, and documented by **Tristen Dennis** — NMU Information Assurance & Cyber Defense.
