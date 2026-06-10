export const LAPTOP_BRANDS = [
  "ASUS", "Acer", "Apple", "Dell", "HP", "Lenovo", "MSI",
  "Microsoft", "Razer", "Samsung", "Toshiba", "LG", "Huawei",
  "Honor", "Gigabyte", "Alienware", "Other",
]

export const SPEC_DEFINITIONS: Record<
  string,
  { label: string; unit?: string; options: string[] }
> = {
  processor: {
    label: "Processor (CPU)",
    options: [
      "Intel Core Ultra 9 285H", "Intel Core Ultra 7 265H", "Intel Core Ultra 7 258V",
      "Intel Core Ultra 5 226V", "Intel Core Ultra 5 235H",
      "Intel Core i9-13900HX", "Intel Core i9-13900H", "Intel Core i7-13700HX",
      "Intel Core i7-13700H", "Intel Core i5-13500H", "Intel Core i5-13420H",
      "Intel Core i3-1315U",
      "Intel Core i9-12900HX", "Intel Core i7-12700H", "Intel Core i5-12500H",
      "Intel Core i5-1240P", "Intel Core i3-1215U",
      "AMD Ryzen 9 7945HX", "AMD Ryzen 9 7940H", "AMD Ryzen 7 7745HX",
      "AMD Ryzen 7 7745H", "AMD Ryzen 7 8845H", "AMD Ryzen 5 8645HS",
      "AMD Ryzen 5 7535H", "AMD Ryzen 5 7530U", "AMD Ryzen 3 7330U",
      "Apple M4 Pro", "Apple M4", "Apple M3 Pro", "Apple M3",
      "Apple M2 Pro", "Apple M2", "Apple M1 Pro", "Apple M1",
      "Snapdragon X Elite", "Snapdragon X Plus",
    ],
  },
  ram: {
    label: "RAM",
    unit: "GB",
    options: ["4 GB", "8 GB", "12 GB", "16 GB", "24 GB", "32 GB", "48 GB", "64 GB", "96 GB", "128 GB"],
  },
  ram_type: {
    label: "RAM Type",
    options: ["DDR4", "DDR5", "LPDDR4X", "LPDDR5", "LPDDR5X", "Unified (Apple)"],
  },
  storage: {
    label: "Storage",
    options: [
      "128 GB SSD", "256 GB SSD", "512 GB SSD",
      "1 TB SSD", "2 TB SSD", "4 TB SSD",
      "256 GB HDD", "512 GB HDD", "1 TB HDD",
      "512 GB SSD + 1 TB HDD", "1 TB SSD + 1 TB HDD",
    ],
  },
  storage_type: {
    label: "Storage Type",
    options: ["NVMe PCIe 4.0 SSD", "NVMe PCIe 3.0 SSD", "SATA SSD", "HDD (5400 rpm)", "HDD (7200 rpm)", "eMMC"],
  },
  gpu: {
    label: "Graphics (GPU)",
    options: [
      "NVIDIA RTX 4090 Laptop", "NVIDIA RTX 4080 Laptop", "NVIDIA RTX 4070 Laptop",
      "NVIDIA RTX 4060 Laptop", "NVIDIA RTX 4050 Laptop",
      "NVIDIA RTX 3080 Ti Laptop", "NVIDIA RTX 3080 Laptop", "NVIDIA RTX 3070 Ti Laptop",
      "NVIDIA RTX 3070 Laptop", "NVIDIA RTX 3060 Laptop", "NVIDIA RTX 3050 Ti Laptop",
      "NVIDIA RTX 3050 Laptop",
      "NVIDIA MX570", "NVIDIA MX550", "NVIDIA GT 1030",
      "AMD Radeon RX 7900M", "AMD Radeon RX 7700S", "AMD Radeon RX 7600S",
      "AMD Radeon RX 6700M", "AMD Radeon RX 6600M",
      "Intel Iris Xe Graphics", "Intel UHD Graphics",
      "AMD Radeon 780M (integrated)", "AMD Radeon Vega (integrated)",
      "Apple GPU (10-core)", "Apple GPU (16-core)", "Apple GPU (30-core)", "Apple GPU (38-core)",
    ],
  },
  display_size: {
    label: "Display Size",
    unit: "inches",
    options: [
      '11.6"', '12"', '13.3"', '13.6"', '14"', '14.5"',
      '15.6"', '16"', '16.1"', '17.3"', '18"',
    ],
  },
  display_resolution: {
    label: "Display Resolution",
    options: [
      "1366 × 768 (HD)", "1920 × 1080 (FHD)", "2560 × 1440 (QHD)",
      "2560 × 1600 (WQXGA)", "3840 × 2160 (4K UHD)", "3840 × 2400 (4K+)",
      "2880 × 1864 (Liquid Retina)", "3024 × 1964 (Liquid Retina XDR)",
    ],
  },
  display_refresh: {
    label: "Refresh Rate",
    unit: "Hz",
    options: ["60 Hz", "90 Hz", "120 Hz", "144 Hz", "165 Hz", "240 Hz", "360 Hz"],
  },
  display_panel: {
    label: "Display Panel Type",
    options: ["IPS LCD", "TN LCD", "VA LCD", "OLED", "AMOLED", "Mini-LED", "Micro-LED", "Retina IPS"],
  },
  battery: {
    label: "Battery",
    unit: "Wh",
    options: [
      "30 Wh", "38 Wh", "42 Wh", "45 Wh", "50 Wh", "54 Wh",
      "56 Wh", "60 Wh", "65 Wh", "72 Wh", "76 Wh", "80 Wh",
      "86 Wh", "90 Wh", "99 Wh",
    ],
  },
  os: {
    label: "Operating System",
    options: [
      "Windows 11 Home", "Windows 11 Pro", "Windows 11 Home (S Mode)",
      "macOS Sequoia", "macOS Sonoma", "macOS Ventura",
      "Ubuntu 24.04 LTS", "Fedora 40", "FreeDOS", "Chrome OS",
    ],
  },
  weight: {
    label: "Weight",
    unit: "kg",
    options: [
      "Under 1 kg", "1.0 kg", "1.1 kg", "1.2 kg", "1.3 kg", "1.4 kg",
      "1.5 kg", "1.6 kg", "1.7 kg", "1.8 kg", "1.9 kg", "2.0 kg",
      "2.2 kg", "2.4 kg", "2.6 kg", "2.8 kg", "3.0 kg+",
    ],
  },
  connectivity: {
    label: "Connectivity / Ports",
    options: [
      "USB-C (Thunderbolt 4)", "USB-C (Thunderbolt 3)", "USB-C (USB 3.2 Gen2)",
      "USB-A 3.2 Gen1", "USB-A 3.2 Gen2", "HDMI 2.0", "HDMI 2.1",
      "DisplayPort 1.4", "SD Card Reader", "microSD Card Reader",
      "3.5mm Audio Jack", "RJ-45 Ethernet", "MagSafe 3",
    ],
  },
  wireless: {
    label: "Wireless",
    options: [
      "Wi-Fi 6 (802.11ax)", "Wi-Fi 6E (802.11ax)", "Wi-Fi 7 (802.11be)",
      "Wi-Fi 5 (802.11ac)", "Bluetooth 5.0", "Bluetooth 5.1",
      "Bluetooth 5.2", "Bluetooth 5.3",
    ],
  },
  color: {
    label: "Color",
    options: [
      "Space Gray", "Silver", "Midnight Black", "Starlight", "Lunar Light",
      "Platinum", "Ice Blue", "Storm Blue", "Glacier White", "Jet Black",
      "Sand Dune", "Obsidian", "Fog Blue", "Moss Green", "Other",
    ],
  },
}
