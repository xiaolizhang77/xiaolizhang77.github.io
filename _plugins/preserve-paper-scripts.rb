require 'fileutils'

# jekyll-terser rewrites every static .js file and has no per-path exclusion.
# Keep the standalone paper sites unchanged after both builds and watch rebuilds.
Jekyll::Hooks.register :site, :post_write do |site|
  ['Proof-R1/assets/site.js', 'XRAG/assets/site.js'].each do |path|
    destination = site.in_dest_dir(path)
    FileUtils.mkdir_p(File.dirname(destination))
    FileUtils.cp(site.in_source_dir(path), destination)
  end
end
