{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { system = system; }; in
      {
        devShells.default = pkgs.mkShell {
          NIX_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.glibc
          ];
          SSL_CERT_FILE="/etc/ssl/certs/ca-bundle.crt";
          packages = with pkgs; [ just uv railway sqlite nodejs_22 postgresql_15];
        };
      }
    );
}
