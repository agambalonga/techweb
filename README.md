# Event Booking
This is the repository of the TechWeb project, a Node.js application dedicated to event booking

## Installation NodeJS and npm

First of all, you need to install NodeJS and npm.

### 1. Download on Windows
First, you need to download the [Windows Installer (.msi)](https://nodejs.org/en/download) file from the official Node.js website. This MSI installer database carries a collection of installer files essential to install, update, or modify the existing Node.js version.

Notably, the installer also carries the Node.js package manager (npm) within it. It means you don’t need to install the npm separately.

When downloading, select the correct version as per your operating system. For example, if you’re using a 64-bit operating system, download the 64-bit version, and if you’re using the 32-bit version, download the 32-bit version

Now, you have to check whether Node.js is successfully installed or not.

To verify the installation and confirm whether the correct version was installed, open your PC’s command prompt and enter the following command:

```bash
node --version
```
```bash
npm --version
```

### 2 Dwonload on MacOS
Installing Node.js on macOS follows almost the same procedure as Windows. All you have to do is to download the installation file for Mac. Then, as soon as you start it up, the installer will walk you through the rest.

Firstly, download the [macOS installer (.pkg)](https://nodejs.org/en/download) file from the Node.js website. There’s only a 64-bit version, so you don’t have to worry about which to download.

To check the Node.js version, you need to open your macOS terminal, click the **Command + Space keys**, or search the **terminal** from the search bar.

To check the Node.js version, type:

```bash
node --version
```
```bash
npm --version
```

### 3 Download on Linux
Before going for Node.js installation, ensure that you have the curl command-line utility installed on your system. If not, then paste this command on your terminal to install curl:

```bash
sudo apt install curl
```
It may ask for your system password to verify the permission of the installation. Once you input the password, the system should begin the curl installation.

You need to copy and paste the Node.js installation command into your terminal (in our case, we can grab it from the Ubuntu distribution page) so that the system can begin the Node.js installation.

For instance, here, we’ll be installing Node.js v14.x. These are the installation commands for Ubuntu:

```bash
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```

```bash
sudo apt-get install -y nodejs
```

The curl command begins the Node.js installation process, updates your system, and downloads all Node.js libraries required to install Node.js on your Linux OS.

As you’ve installed Node.js, you can verify to check whether the installation is successful or not. To confirm the installation, you need to run two simple Linux commands on your Linux terminal.

To check the Node.js version, type:

```bash
node --version
```
```bash
npm --version
```

## Project Setup
First of all you need to checkout project. Run this command on your terminal

```bash
git checkout https://github.com/agambalonga/techweb-events-booking.git
```

Go to the project folder and open a terminal in the current directory and run this commands to install all dependencies.

```bash
cd events-booking
npm install
```

Once the dependencies are installed, you can start the server using the following command

```bash
node app
```

The application will be available at [http://localhost:3000](https://localhost:3000)



## License

[MIT](doc:LICENSE)
