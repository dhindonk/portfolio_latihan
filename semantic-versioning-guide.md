# Semantic Versioning (SemVer) Guide

Panduan ini didasarkan pada spesifikasi Semantic Versioning (semver.org) dan digunakan untuk menentukan penamaan versi (branch atau release) pada projek ini.

## Format Versi
Format utama dari Semantic Versioning adalah:
**MAJOR.MINOR.PATCH** (contoh: `1.9.0`)

Versi harus di-increment (ditambah) dengan aturan berikut:

### 1. MAJOR (Versi Mayor)
Naikkan versi MAJOR ketika Anda membuat **perubahan API yang tidak kompatibel** (breaking changes).
- Contoh: Menghapus fitur lama, merombak total struktur database yang tidak backwards-compatible, atau mengubah flow utama yang menyebabkan implementasi sebelumnya rusak.
- Saat MAJOR naik, MINOR dan PATCH harus di-reset ke 0 (contoh: `1.9.5` -> `2.0.0`).

### 2. MINOR (Versi Minor)
Naikkan versi MINOR ketika Anda **menambahkan fitur baru** yang backwards-compatible (tidak merusak fungsionalitas yang ada).
- Contoh: Menambahkan fitur baru (seperti uploader R2, halaman baru), menambahkan field opsional pada API, atau melakukan refactor besar yang masih aman.
- Saat MINOR naik, PATCH harus di-reset ke 0 (contoh: `1.9.2` -> `1.10.0`).

### 3. PATCH (Versi Patch)
Naikkan versi PATCH ketika Anda melakukan **bug fixes** yang backwards-compatible.
- Contoh: Memperbaiki error UI, memperbaiki logika kalkulasi, menangani null pointer, atau optimasi internal tanpa mengubah perilaku eksternal API.
- Contoh increment: `1.9.0` -> `1.9.1`.

---

## Aturan Tambahan & Workflow Branching
- Versi `0.y.z` digunakan untuk fase inisial/development awal dimana hal-hal masih sangat tidak stabil.
- Pada repository ini, branch rilis fitur baru biasanya diberi nama sesuai dengan versi tujuannya (contoh: `develop/1.10.0`).
- Branch fitur atau task spesifik (seperti `dev/storage-upload`) akan di-Pull Request dan di-merge ke branch `develop/[Versi]`.
- Jangan menggunakan awalan 'v' pada nama branch kecuali memang disepakati, ikuti konvensi yang sudah ada (contoh: `develop/1.9.0` bukan `develop/v1.9.0`).
