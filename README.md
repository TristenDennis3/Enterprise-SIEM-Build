# Enterprise SIEM Network

A fully segmented, **air-gapped Security Information and Event Management (SIEM) network**
built to emulate adversary activity and detect it across both network and host sensors.
Four isolated VLANs, dual SIEM platforms, live attack simulation, and custom detection
engineering, documented end to end.

Completed as an independent study and internship.

**Designed, built, and documented by Tristen Dennis.**
🔗 Live site: https://tristendennis3.github.io/Enterprise-SIEM-Build/

---

## What this is

A working model of an enterprise detection environment, run entirely air-gapped from the
internet. Attacks are launched from a dedicated offensive VLAN against a victim network, and
every action is caught by a layered detection stack: the **network sensor** sees delivery and
traffic, while the **host sensor** sees local execution.

## Network architecture

| VLAN | Zone | Contents |
|------|------|----------|
| **10** | Management | pfSense, UniFi Controller, Proxmox (trusted admin interfaces only) |
| **20** | SIEM Monitoring | Security Onion, Wazuh, Nessus (receives mirrored SPAN traffic, one-way) |
| **30** | Victim Network | Active Directory (DC01), Metasploitable 3, Windows 11, DVWA |
| **40** | Attack Network | Kali Linux offensive host |

Inter-VLAN routing and firewall policy run on a Netgate 2100 (pfSense+). A UniFi
USW-Pro-Max-16-PoE Layer 3 switch handles VLAN tagging and a SPAN mirror port that copies
every VLAN's traffic to Security Onion.

## Detection stack

- **Security Onion**: network SIEM (Suricata + Zeek) analyzing mirrored SPAN traffic
- **Wazuh**: host-based EDR/HIDS with agents on every machine
- **Nessus**: vulnerability scanning of network and endpoints
- **Custom Wazuh rules**: Kerberoasting, noise suppression, attack-subnet authentication,
  and brute-force + success correlation, each validated by running the matching attack
- **SPAN-flood script**: forces the bridge port to flood all traffic to the sensor

## Attacks emulated & detected

Ten attacks mapped to MITRE ATT&CK, spanning Discovery, Initial Access, Execution,
Credential Access, Lateral Movement, and Command & Control, including Kerberoasting,
DCSync, Pass-the-Hash, SQL injection, XSS, command injection, Hydra RDP brute force, a
ProFTPD exploit, and Sliver C2 implant delivery.

## Hardware

Netgate 2100 firewall · UniFi USW-Pro-Max-16-PoE L3 switch · Ryzen Proxmox host
(RTX 5070, 32 GB, 2 TB) · Lenovo Legion 7i · CyberPower UPS · CAT.6 patch panel ·
AC Infinity cooling · wall-mounted server rack.

## The site

A multi-page static site (plain HTML / CSS / JavaScript) hosted on GitHub Pages, covering
the network diagram, hardware, software stack, attacks & detections, custom detection rules,
a build gallery, and full written documentation.

## Documentation

Written investigations and configuration references produced as deliverables for the
independent study, covering the Wazuh offline install, interface & bridge mapping, a
CVSS-scored vulnerability assessment, SIEM hunting queries, firewall rules, the full network
& hardware build, an Active Directory attack-chain case study, and a risk-prioritization
matrix.

---

*Domain: `siemlab.local` · DC01 at `10.0.30.10` · SIEM subnet `10.0.20.0/24` · Attack subnet `10.0.40.0/24`*
