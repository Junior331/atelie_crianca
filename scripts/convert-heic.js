const fs = require('fs').promises;
const path = require('path');
const convert = require('heic-convert');

async function convertHeicToJpeg(inputPath, outputPath) {
  try {
    const inputBuffer = await fs.readFile(inputPath);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.85
    });
    
    await fs.writeFile(outputPath, outputBuffer);
    console.log(`✅ Converted: ${inputPath} → ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return false;
  }
}

async function findAndConvertHeicFiles(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    let converted = 0;
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        // Recursivamente processar subdiretórios
        const subConverted = await findAndConvertHeicFiles(fullPath);
        converted += subConverted;
      } else if (file.name.toLowerCase().endsWith('.heic')) {
        // Converter arquivo HEIC
        const outputPath = fullPath.replace(/\.heic$/i, '.jpeg');
        const success = await convertHeicToJpeg(fullPath, outputPath);
        if (success) converted++;
      }
    }
    
    return converted;
  } catch (error) {
    console.error(`❌ Error processing directory ${directory}:`, error.message);
    return 0;
  }
}

async function main() {
  const oficinasPath = path.join(process.cwd(), 'public', 'images', 'oficinas');
  
  console.log('🔄 Iniciando conversão de arquivos HEIC...');
  console.log(`📁 Diretório: ${oficinasPath}`);
  
  try {
    await fs.access(oficinasPath);
  } catch (error) {
    console.error('❌ Diretório de oficinas não encontrado:', oficinasPath);
    process.exit(1);
  }
  
  const totalConverted = await findAndConvertHeicFiles(oficinasPath);
  
  console.log(`\n✨ Conversão concluída! ${totalConverted} arquivos convertidos.`);
  
  if (totalConverted > 0) {
    console.log('\n📝 Recomendações:');
    console.log('1. Verifique as imagens convertidas');
    console.log('2. Considere remover os arquivos .heic originais se estão corretos');
    console.log('3. Reinicie o servidor de desenvolvimento');
  }
}

main().catch(console.error);