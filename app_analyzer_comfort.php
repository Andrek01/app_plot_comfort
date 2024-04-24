<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU - App Plot Analyzer Comfort
 * @author      Andre Kohler
 * @copyright   2022
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../lib/includes.php';



// ************************************************
// function to get all stored set in pages/<your_pages>
// ************************************************
function getFileArray($suffix) {
    $dir = const_path.'pages/'.config_pages;
    $dirlist = dir($dir);
		while (($item = $dirlist->read()) !== false) {
			if (substr($item, 0, 1) != '.') {
				if (substr($item, -strlen($suffix)) == $suffix) {
					$id = str_replace('/', '-', $dir . '/' . $item);
					$id = str_replace('.', '-', $id);
					$ret[] =  $item;
				}
			}			
		}
		$dirlist->close();
		return (json_encode($ret));
	}

// ************************************************
// function to get the path of the active pages
// ************************************************

function get_page_path($value)
{
	$myValue = config_pages;
	return ($myValue);
}

// ************************************************
// function to get the settings for the Sets
// ************************************************

function get_set_settings($value)
{
   $file    = $value["filename"];
   $myFile = file_get_contents(const_path.'pages/'.config_pages.'/'.$file.'.pac');
   if ($myFile  != false)
	   {
  		return ($myFile);
	   }
  else
  {
	  //$myFile="{'const_path':'".const_path."','config_pages':'".config_pages."'}";
	  $myFile='{}';
  }
  return ($myFile);
}

// ************************************************
// function to get the series and lists from backend
// ************************************************

function get_set_series_items($value)
{
   $myFile = file_get_contents(const_path.'pages/'.config_pages.'/series_items.json');
   if ($myFile  != false)
	   {
  		return ($myFile);
	   }
  else
  {
	  //$myFile="{'const_path':'".const_path."','config_pages':'".config_pages."'}";
	  $myFile='{}';
  }
  return ($myFile);
}

// ************************************************
// function to store the settings for the Sets
// ************************************************

function store_set_settings($value)
{
  $content = $value["data"];
  $file    = $value["filename"];
  file_put_contents(const_path.'pages/'.config_pages.'/'.$file.'.pac', $content);
	return ('OK');
}


// ************************************************
// main
// ************************************************

$command = $_GET["command"];

switch ($command)
{
    case 'get_page_path':
        $ret = get_page_path($_GET);
        break;
    case 'get_set_settings':
        $ret = get_set_settings($_GET);
        break;        
    case 'store_set_settings':
        $ret = store_set_settings($_GET);
        break;
    case 'getFileArray':
        $ret = getFileArray($_GET['suffix']);
        break;
    case 'get_set_series_items':
        $ret = get_set_series_items($_GET);
        break;
}
echo $ret;
?>

