# Stolen from Félix Saparelli <aur@passcod.name> and Aki Jenkinson <aki@aki.pw>

pkgname=Chunks
pkgver=0.0.1
pkgrel=1
pkgdesc="A somewhat working Chunks POC"
arch=("any")
url="https://github.com/pldubouilh/chunks-gui"
license=("GPL-3.0")
depends=("npm ")
source=("https://github.com/passcod/twd/releases/download/v${pkgver}/twd-${pkgver}-all.nw")
noextract=("twd-${pkgver}-all.nw")
sha512sums=("0271ac93adf19f71b06283a14a008ab3ccbb56061cdcf020140589cb4162e021998bcd6f264cf6cf17e2163ccf9f81357346fe5b573939a786f22a3d0d66715d")

build() {
  cd $srcdir
  cp twd-${pkgver}-all.nw assets.zip
  unzip assets.zip
}

package() {
  cd $srcdir
  install -Dm644 twd-${pkgver}-all.nw $pkgdir/opt/twd/twd.nw
  install -Dm644 LICENSE $pkgdir/usr/share/licences/twd/LICENSE
  install -Dm644 icon.png $pkgdir/usr/share/pixmaps/twd.png
  install -Dm755 releng/arch/twd $pkgdir/usr/bin/twd
  install -Dm644 releng/arch/twd.desktop $pkgdir/usr/share/applications/twd.desktop
}
