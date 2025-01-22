{
  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixpkgs-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { system = system; config.allowUnfree = true; }; in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ python39 git just nodejs_20 ];
        };
      }
    );
}
